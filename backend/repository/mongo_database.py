import logging
import pymongo


class MongoDatabase:
    def __init__(self,
            host="localhost",
            port=27017,
            username="root",
            password="1234",
            database_name="sample_database",
            collection_name="article_info",
        ):
        """
        MongoDB 연결 및 컬렉션 설정을 위한 초기화 메서드

        Args:
            host (str): MongoDB 호스트 주소
            port (int): MongoDB 포트 번호
            username (str): MongoDB 사용자 이름
            password (str): MongoDB 비밀번호
            database_name (str): 사용할 데이터베이스 이름
            collection_name (str): 사용할 컬렉션 이름
        """
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.database_name = database_name
        self.collection_name = collection_name
        self.client = None  # MongoDB 클라이언트 객체
        self.db = None      # 사용할 데이터베이스 객체
        self.collection = None # 사용할 컬렉션 객체

        self.logger = self._get_logger()

    def _get_logger(self, service_name: str = "mongo_database"):
        
        logger = logging.getLogger()
        logger.setLevel(logging.WARN)
        formatter = logging.Formatter(f"%(asctime)s [{service_name.upper()}] %(levelname)s: %(message)s")
        handler = logging.StreamHandler()
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def connect(self):
        try:
            self.client = pymongo.MongoClient(
                host=self.host,
                port=self.port,
                username=self.username,
                password=self.password,
                authSource='admin' # root 계정은 admin DB에 권한이 있을 가능성이 높음
            )
            self.db = self.client[self.database_name]
            self.collection = self.db[self.collection_name]
            self.logger.warning("MongoDB 연결 성공")
        except pymongo.errors.ConnectionFailure as e:
            self.logger.warning(f"MongoDB 연결 실패: {e}")
            raise

    def insert_data(self, data):
        try:
            if isinstance(data, list):
                result = self.collection.insert_many(data)
                self.logger.warning(f"데이터 {len(data)}건 저장 성공. IDs: {result.inserted_ids}")
            elif isinstance(data, dict):
                result = self.collection.insert_one(data)
                self.logger.warning(f"데이터 1건 저장 성공. ID: {result.inserted_id}")
            else:
                self.logger.warning("잘못된 데이터 타입입니다. dict 또는 list 타입의 데이터를 입력해주세요.")
        except pymongo.errors.PyMongoError as e:
            self.logger.warning(f"데이터 저장 실패: {e}")
            raise

    def close_connection(self):
        if self.client:
            self.client.close()
            self.logger.warning("MongoDB 연결 종료")