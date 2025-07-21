from app.models import YourModel  # Replace with your actual model
from app.schemas import YourSchema  # Replace with your actual schema
from sqlalchemy.orm import Session


class YourService:
    def __init__(self, db: Session):
        self.db = db

    def create_item(self, item: YourSchema):
        db_item = YourModel(**item.dict())
        self.db.add(db_item)
        self.db.commit()
        self.db.refresh(db_item)
        return db_item

    def get_item(self, item_id: int):
        return self.db.query(YourModel).filter(YourModel.id == item_id).first()

    def get_all_items(self):
        return self.db.query(YourModel).all()

    def update_item(self, item_id: int, item: YourSchema):
        db_item = self.get_item(item_id)
        if db_item:
            for key, value in item.dict().items():
                setattr(db_item, key, value)
            self.db.commit()
            self.db.refresh(db_item)
        return db_item

    def delete_item(self, item_id: int):
        db_item = self.get_item(item_id)
        if db_item:
            self.db.delete(db_item)
            self.db.commit()
        return db_item
