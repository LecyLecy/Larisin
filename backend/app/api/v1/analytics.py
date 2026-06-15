from fastapi import APIRouter

from app.schemas.analytics import AnalyticsSummary
from app.services.sample_data import get_analytics_summary

router = APIRouter()


@router.get("/summary", response_model=AnalyticsSummary)
def read_summary() -> AnalyticsSummary:
    return get_analytics_summary()
