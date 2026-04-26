"""
T-042: Failing unit tests for GroupRepository.
Uses a real in-memory SQLite DB.
"""
import pytest
import pytest_asyncio
import uuid

TEST_DB_URL = "sqlite+aiosqlite:///./test_group_repo.db"


@pytest_asyncio.fixture
async def db_session():
    import os
    from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
    from sqlalchemy.pool import NullPool
    # Import models FIRST to ensure they are registered on Base.metadata
    import src.features.auth.model  # noqa: F401
    import src.features.groups.model  # noqa: F401
    from src.shared.database import Base

    db_path = os.path.abspath("./test_group_repo.db")
    # Remove leftover file from a previous failed run
    if os.path.exists(db_path):
        os.remove(db_path)

    engine = create_async_engine(TEST_DB_URL, echo=False, poolclass=NullPool)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()
    if os.path.exists(db_path):
        os.remove(db_path)


class TestGroupRepository:
    """Integration-style unit tests — GroupRepository against real in-memory SQLite."""

    @pytest.mark.asyncio
    async def test_save_and_get_by_id(self, db_session):
        """save a Group then get_by_id returns the same group."""
        from src.features.groups.model import Group, GroupMembership
        from src.features.groups.repository import GroupRepository, MembershipRepository
        from src.features.auth.model import User

        # Create a user first
        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = GroupRepository(db_session)
        group = Group(
            name="Family Budget",
            description="Shared family expenses",
            created_by=user.id,
        )
        saved = await repo.save(group)
        found = await repo.get_by_id(saved.id)

        assert found is not None
        assert found.id == saved.id
        assert found.name == "Family Budget"

    @pytest.mark.asyncio
    async def test_get_by_id_not_found(self, db_session):
        """get_by_id for a random UUID that doesn't exist returns None."""
        from src.features.groups.repository import GroupRepository

        repo = GroupRepository(db_session)
        result = await repo.get_by_id(uuid.uuid4())

        assert result is None

    @pytest.mark.asyncio
    async def test_get_by_user(self, db_session):
        """get_by_user returns all groups that a user is a member of."""
        from src.features.groups.model import Group, GroupMembership
        from src.features.groups.repository import GroupRepository, MembershipRepository
        from src.features.auth.model import User

        # Create users
        user1 = User(email="user1@example.com", hashed_password="hashed_pw", role="user")
        user2 = User(email="user2@example.com", hashed_password="hashed_pw", role="user")
        db_session.add_all([user1, user2])
        await db_session.commit()
        await db_session.refresh(user1)
        await db_session.refresh(user2)

        group_repo = GroupRepository(db_session)
        membership_repo = MembershipRepository(db_session)

        # Create groups
        g1 = Group(name="Group 1", created_by=user1.id)
        g2 = Group(name="Group 2", created_by=user2.id)
        await group_repo.save(g1)
        await group_repo.save(g2)

        # Add memberships
        m1 = GroupMembership(group_id=g1.id, user_id=user1.id, role="admin")
        m2 = GroupMembership(group_id=g2.id, user_id=user1.id, role="member")
        await membership_repo.save(m1)
        await membership_repo.save(m2)

        user1_groups = await group_repo.get_by_user(user1.id)
        assert len(user1_groups) == 2

    @pytest.mark.asyncio
    async def test_update(self, db_session):
        """update modifies an existing group."""
        from src.features.groups.model import Group
        from src.features.groups.repository import GroupRepository
        from src.features.auth.model import User

        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = GroupRepository(db_session)
        group = Group(name="Test Group", created_by=user.id)
        saved = await repo.save(group)

        # Update the group
        saved.name = "Updated Group Name"
        updated = await repo.update(saved)

        assert updated.name == "Updated Group Name"

    @pytest.mark.asyncio
    async def test_delete(self, db_session):
        """delete removes a group."""
        from src.features.groups.model import Group
        from src.features.groups.repository import GroupRepository
        from src.features.auth.model import User

        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = GroupRepository(db_session)
        group = Group(name="Test Group", created_by=user.id)
        saved = await repo.save(group)

        await repo.delete(saved.id)
        found = await repo.get_by_id(saved.id)
        assert found is None


class TestMembershipRepository:
    """Tests for MembershipRepository."""

    @pytest.mark.asyncio
    async def test_is_member(self, db_session):
        """is_member returns True if user is a member of the group."""
        from src.features.groups.model import Group, GroupMembership
        from src.features.groups.repository import GroupRepository, MembershipRepository
        from src.features.auth.model import User

        user1 = User(email="user1@example.com", hashed_password="hashed_pw", role="user")
        user2 = User(email="user2@example.com", hashed_password="hashed_pw", role="user")
        db_session.add_all([user1, user2])
        await db_session.commit()
        await db_session.refresh(user1)
        await db_session.refresh(user2)

        group_repo = GroupRepository(db_session)
        membership_repo = MembershipRepository(db_session)

        group = Group(name="Test Group", created_by=user1.id)
        await group_repo.save(group)

        membership = GroupMembership(group_id=group.id, user_id=user1.id, role="admin")
        await membership_repo.save(membership)

        assert await membership_repo.is_member(user1.id, group.id) is True
        assert await membership_repo.is_member(user2.id, group.id) is False

    @pytest.mark.asyncio
    async def test_is_admin(self, db_session):
        """is_admin returns True if user is an admin of the group."""
        from src.features.groups.model import Group, GroupMembership
        from src.features.groups.repository import GroupRepository, MembershipRepository
        from src.features.auth.model import User

        user1 = User(email="user1@example.com", hashed_password="hashed_pw", role="user")
        user2 = User(email="user2@example.com", hashed_password="hashed_pw", role="user")
        db_session.add_all([user1, user2])
        await db_session.commit()
        await db_session.refresh(user1)
        await db_session.refresh(user2)

        group_repo = GroupRepository(db_session)
        membership_repo = MembershipRepository(db_session)

        group = Group(name="Test Group", created_by=user1.id)
        await group_repo.save(group)

        admin_membership = GroupMembership(group_id=group.id, user_id=user1.id, role="admin")
        member_membership = GroupMembership(group_id=group.id, user_id=user2.id, role="member")
        await membership_repo.save(admin_membership)
        await membership_repo.save(member_membership)

        assert await membership_repo.is_admin(user1.id, group.id) is True
        assert await membership_repo.is_admin(user2.id, group.id) is False
