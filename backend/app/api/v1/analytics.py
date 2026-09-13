from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.analytics import AnalyticsSummary
from app.services.analytics import get_analytics_summary

router = APIRouter()


@router.get("/summary", response_model=AnalyticsSummary)
def read_summary(session: Annotated[Session, Depends(get_db)]) -> AnalyticsSummary:
    return get_analytics_summary(session)
