"""Add stopped status to enum

Revision ID: 5a6b69e2679c
Revises: f6754ed18fee
Create Date: 2024-04-11 04:48:30.206455

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5a6b69e2679c'
down_revision = 'f6754ed18fee'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("ALTER TYPE detectionstatus ADD VALUE 'STOPPED'")
    pass


def downgrade():
    pass
