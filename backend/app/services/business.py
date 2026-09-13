from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_BUSINESS_ID
from app.models.business import Business
from app.schemas.business import BusinessProfile, BusinessProfileUpdate


def get_business_profile(session: Session) -> BusinessProfile:
    business = session.get(Business, DEFAULT_BUSINESS_ID)
    if business is None:
        raise RuntimeError("Default business is missing")
    return _to_profile(business)


def update_business_profile(session: Session, payload: BusinessProfileUpdate) -> BusinessProfile:
    with session.begin():
        business = session.get(Business, DEFAULT_BUSINESS_ID, with_for_update=True)
        if business is None:
            raise RuntimeError("Default business is missing")
        business.name = payload.name
        business.business_category = payload.business_category
        session.flush()
        return _to_profile(business)


def _to_profile(business: Business) -> BusinessProfile:
    return BusinessProfile(
        name=business.name,
        business_category=business.business_category,
        currency_code=business.currency_code,
    )
