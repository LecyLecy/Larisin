from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.business import BusinessProfile, BusinessProfileUpdate
from app.services.business import get_business_profile, update_business_profile

router = APIRouter()


@router.get("/profile", response_model=BusinessProfile)
def read_business_profile(
    session: Annotated[Session, Depends(get_db)],
) -> BusinessProfile:
    return get_business_profile(session)


@router.patch("/profile", response_model=BusinessProfile)
def edit_business_profile(
    payload: BusinessProfileUpdate,
    session: Annotated[Session, Depends(get_db)],
) -> BusinessProfile:
    return update_business_profile(session, payload)
