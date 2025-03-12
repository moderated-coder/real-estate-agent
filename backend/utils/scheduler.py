import logging
import threading
import time
import schedule
from typing import Callable

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s [SCHEDULER] %(levelname)s: %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

class Scheduler:
    def __init__(self):
        self.stop_event = threading.Event()
        self.thread = None
    
    def start(self):
        if self.thread and self.thread.is_alive():
            logger.warning("Scheduler is already running")
            return
            
        self.stop_event.clear()
        self.thread = threading.Thread(target=self._run_scheduler)
        self.thread.daemon = True
        self.thread.start()
        logger.info("Scheduler started")
    
    def stop(self):
        if not self.thread or not self.thread.is_alive():
            logger.warning("Scheduler is not running")
            return
            
        self.stop_event.set()
        self.thread.join(timeout=5)
        logger.info("Scheduler stopped")
    
    def _run_scheduler(self):
        while not self.stop_event.is_set():
            schedule.run_pending()
            time.sleep(1)
    
    def schedule_job(self, interval_minutes: int, job_func: Callable, *args, **kwargs):
        schedule.every(interval_minutes).minutes.do(job_func, *args, **kwargs)
        logger.info(f"Scheduled job {job_func.__name__} to run every {interval_minutes} minutes")

# Create a singleton instance
scheduler = Scheduler() 