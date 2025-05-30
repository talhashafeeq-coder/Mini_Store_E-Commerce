"""Fixing

Revision ID: 501e08a0dce7
Revises: 8c52336e619a
Create Date: 2025-02-17 02:40:52.055411

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '501e08a0dce7'
down_revision = '8c52336e619a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shopping_card', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(display_width=11),
               nullable=False)
        batch_op.drop_constraint('shopping_card_ibfk_2', type_='foreignkey')
        batch_op.drop_column('product_id')

    with op.batch_alter_table('shopping_card_details', schema=None) as batch_op:
        batch_op.add_column(sa.Column('shopping_card_id', sa.Integer(), nullable=False))
        batch_op.drop_constraint('shopping_card_details_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key(None, 'shopping_card', ['shopping_card_id'], ['id'])
        batch_op.drop_column('card_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shopping_card_details', schema=None) as batch_op:
        batch_op.add_column(sa.Column('card_id', mysql.INTEGER(display_width=11), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('shopping_card_details_ibfk_1', 'shopping_card', ['card_id'], ['id'])
        batch_op.drop_column('shopping_card_id')

    with op.batch_alter_table('shopping_card', schema=None) as batch_op:
        batch_op.add_column(sa.Column('product_id', mysql.INTEGER(display_width=11), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('shopping_card_ibfk_2', 'products', ['product_id'], ['id'])
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(display_width=11),
               nullable=True)

    # ### end Alembic commands ###
