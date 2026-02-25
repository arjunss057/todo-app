from pydantic import BaseModel

class InsertTask(BaseModel):
    item: str

class ToggleComplete(BaseModel):
    id: int

class UpdateTask(BaseModel):
    id: int
    item: str
