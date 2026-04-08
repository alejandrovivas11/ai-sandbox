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
    with op.batch_alter_table("staff", schema=None) as batch_op:
        batch_op.add_column(sa.Column("address", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("emergency_contact", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("employee_id", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("position", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("start_date", sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column("work_location", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("pay_type", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("pay_rate", sa.Float(), nullable=True))
        batch_op.add_column(sa.Column("pay_frequency", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("benefits_enrolled", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("earnings", sa.Float(), nullable=True, default=0.0))
        batch_op.add_column(sa.Column("clients_count", sa.Integer(), nullable=True, default=0))
        batch_op.add_column(sa.Column("utilized_hours", sa.Float(), nullable=True, default=0.0))
        batch_op.add_column(sa.Column("cancelled_hours", sa.Float(), nullable=True, default=0.0))
        batch_op.create_unique_constraint('uq_staff_employee_id', ['employee_id'])


def downgrade() -> None:
    with op.batch_alter_table("staff", schema=None) as batch_op:
        batch_op.drop_constraint('uq_staff_employee_id', type_='unique')
        batch_op.drop_column("cancelled_hours")
        batch_op.drop_column("utilized_hours")
        batch_op.drop_column("clients_count")
        batch_op.drop_column("earnings")
        batch_op.drop_column("benefits_enrolled")
        batch_op.drop_column("pay_frequency")
        batch_op.drop_column("pay_rate")
        batch_op.drop_column("pay_type")
        batch_op.drop_column("work_location")
        batch_op.drop_column("start_date")
        batch_op.drop_column("position")
        batch_op.drop_column("employee_id")
        batch_op.drop_column("emergency_contact")
        batch_op.drop_column("address")
