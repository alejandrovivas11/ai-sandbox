"""Expand staff profile with additional fields

Revision ID: 002
Revises: 001
Create Date: 2024-01-02 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("staff", sa.Column("address", sa.String(), nullable=True))
    op.add_column("staff", sa.Column("emergency_contact", sa.String(), nullable=True))
    op.add_column("staff", sa.Column("employee_id", sa.String(), nullable=True, unique=True))
    op.add_column("staff", sa.Column("position", sa.String(), nullable=True))
    op.add_column("staff", sa.Column("start_date", sa.DateTime(), nullable=True))
    op.add_column("staff", sa.Column("work_location", sa.String(), nullable=True))
    op.add_column("staff", sa.Column("pay_type", sa.String(), nullable=True))
    op.add_column("staff", sa.Column("pay_rate", sa.Float(), nullable=True))
    op.add_column("staff", sa.Column("pay_frequency", sa.String(), nullable=True))
    op.add_column("staff", sa.Column("benefits_enrolled", sa.String(), nullable=True))
    op.add_column("staff", sa.Column("earnings", sa.Float(), nullable=True, default=0.0))
    op.add_column("staff", sa.Column("clients_count", sa.Integer(), nullable=True, default=0))
    op.add_column("staff", sa.Column("utilized_hours", sa.Float(), nullable=True, default=0.0))
    op.add_column("staff", sa.Column("cancelled_hours", sa.Float(), nullable=True, default=0.0))


def downgrade() -> None:
    op.drop_column("staff", "cancelled_hours")
    op.drop_column("staff", "utilized_hours")
    op.drop_column("staff", "clients_count")
    op.drop_column("staff", "earnings")
    op.drop_column("staff", "benefits_enrolled")
    op.drop_column("staff", "pay_frequency")
    op.drop_column("staff", "pay_rate")
    op.drop_column("staff", "pay_type")
    op.drop_column("staff", "work_location")
    op.drop_column("staff", "start_date")
    op.drop_column("staff", "position")
    op.drop_column("staff", "employee_id")
    op.drop_column("staff", "emergency_contact")
    op.drop_column("staff", "address")
