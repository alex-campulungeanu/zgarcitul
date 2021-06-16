from datetime import datetime
from sqlalchemy.ext.declarative import declared_attr

from app.models import db
from app.shared.helper import get_current_date

# class TimestampMixin(object):
#     __abstract__ = True
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     modified_at = db.Column(db.DateTime, default=datetime.utcnow)
#     def save(self, *args, **kwargs):
#         if not self.created_at:
#             self.created_at = get_current_date()
#         self.modified_at = get_current_date()
#         return super(TimestampMixin, self).save(*args, **kwargs)

# class TimestampMixin(object):
#     @declared_attr
#     def created_on(self):
#         return db.Column(
#         db.DateTime, nullable=False, default=datetime.utcnow
#         )
#     @declared_attr
#     def updated_on(self):
#         return db.Column(db.DateTime, onupdate=datetime.utcnow, default=datetime.utcnow)

class TimestampMixin(object):
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)