from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import os
from dotenv import load_dotenv
import datetime

from models import InsertTask, ToggleComplete, UpdateTask

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["GET", "POST", "PATCH", "DELETE"],
    allow_headers = ["*"]
)

@app.get("/")
def root():
    message= "You have reached the middleware root"
    return {
        "message": message
    }

@app.post("/add")
def add_item(item: InsertTask):
    try:
        response = supabase.table("todolist").insert(item.dict()).execute()
        return {
            "response": response
        }
    except Exception as e:
        return {"error": e}

@app.get("/get-items")
def get_items():
    try:
        response = supabase.table("todolist").select("id, item, created_at, completed").order("id", desc=False).execute()
        return response
    except Exception as e:
        return {"error": e}
    
@app.patch("/complete")
def toggle_complete(id: ToggleComplete):
    
    try:
        pre_res = supabase.table("todolist").select("completed").eq("id", id.dict()["id"]).single().execute()
        current = pre_res.data["completed"]
        toggled = not current
        print("Toggled: ", toggled, "current: ", current)

        response = supabase.table("todolist").update({
            "completed": toggled
        }).eq("id", id.dict()["id"]).execute()
        return response
    except Exception as e:
        return e

@app.patch("/update-task")
def update_task(body: UpdateTask):
    try:
        response = supabase.table("todolist").update({
            "item": body.dict()["item"]
        }).eq("id", body.dict()["id"]).execute()

        return response
    except Exception as e:
        return e
    
@app.delete("/delete-completed")
def delete_completed():
    try:
        response = supabase.table("todolist").delete().eq("completed", True).execute()
        return response
    except Exception as e:
        return e

@app.middleware("http")    
async def log_request_time(request: Request, call_next):
    print(f"{request.method} {request.url} - {datetime.datetime.now()}")
    response = await call_next(request)
    return response
