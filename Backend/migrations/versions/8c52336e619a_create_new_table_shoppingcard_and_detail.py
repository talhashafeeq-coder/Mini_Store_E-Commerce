"""Create New Table shoppingCard and detail

Revision ID: 8c52336e619a
Revises: af7347d21564
Create Date: 2025-02-17 02:07:51.114254

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '8c52336e619a'
down_revision = 'af7347d21564'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shopping_card', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))
        batch_op.drop_column('quantity')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shopping_card', schema=None) as batch_op:
        batch_op.add_column(sa.Column('quantity', mysql.INTEGER(display_width=11), autoincrement=False, nullable=False))
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')

    # ### end Alembic commands ###
