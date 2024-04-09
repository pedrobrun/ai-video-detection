"""initial migration

Revision ID: 273497cd20a5
Revises: 
Create Date: 2024-04-09 02:32:30.217409

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '273497cd20a5'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('video',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('video_data', sa.LargeBinary(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('detection',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('confidence', sa.Float(), nullable=False),
    sa.Column('iou', sa.Float(), nullable=False),
    sa.Column('status', sa.Enum('PROCESSING', 'SUCCESS', 'FAILED', name='detectionstatus'), nullable=False),
    sa.Column('model_name', sa.String(length=255), nullable=False),
    sa.Column('video_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['video_id'], ['video.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('prediction',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('video_id', sa.Integer(), nullable=False),
    sa.Column('class_name', sa.String(length=255), nullable=False),
    sa.Column('confidence', sa.Float(), nullable=False),
    sa.Column('box_left', sa.Integer(), nullable=False),
    sa.Column('box_top', sa.Integer(), nullable=False),
    sa.Column('box_width', sa.Integer(), nullable=False),
    sa.Column('box_height', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('detection_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['detection_id'], ['detection.id'], ),
    sa.ForeignKeyConstraint(['video_id'], ['video.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('prediction')
    op.drop_table('detection')
    op.drop_table('video')
    # ### end Alembic commands ###
