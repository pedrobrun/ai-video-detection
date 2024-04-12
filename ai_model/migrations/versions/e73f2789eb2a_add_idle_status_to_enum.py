"""Add idle status to enum

Revision ID: e73f2789eb2a
Revises: 5a6b69e2679c
Create Date: 2024-04-11 20:59:20.818587

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e73f2789eb2a'
down_revision = '5a6b69e2679c'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("ALTER TYPE detectionstatus ADD VALUE 'IDLE'")
    pass


def downgrade():
    pass
