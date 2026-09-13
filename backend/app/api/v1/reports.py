from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.report import ReportOverview
from app.services.reports import get_report_overview

router = APIRouter()


@router.get("/overview", response_model=ReportOverview)
def read_overview(
    session: Annotated[Session, Depends(get_db)],
    days: Annotated[int, Query(ge=1, le=365)] = 30,
) -> ReportOverview:
    return get_report_overview(session, days)
