import os

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"

import pytest
from sqlalchemy import delete

from app.core.constants import DEFAULT_BUSINESS_ID
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import Business, InventoryMovement, Product, SalesTransaction, SalesTransactionItem

Base.metadata.create_all(engine)


@pytest.fixture(autouse=True)
def reset_database() -> None:
    with SessionLocal() as session:
        session.execute(delete(InventoryMovement))
        session.execute(delete(SalesTransactionItem))
        session.execute(delete(SalesTransaction))
        session.execute(delete(Product))
        business = session.get(Business, DEFAULT_BUSINESS_ID)
        if business is None:
            session.add(
                Business(
                    id=DEFAULT_BUSINESS_ID,
                    name="Toko Rina Jaya",
                    business_category="Toko Kelontong",
                    currency_code="IDR",
                )
            )
        session.commit()
