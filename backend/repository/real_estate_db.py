import sqlite3

class RealEstateDB:
    _instance = None  # 싱글톤 인스턴스를 저장할 클래스 변수

    def __init__(self):
        if RealEstateDB._instance is not None:
            raise Exception("RealEstateDB 싱글톤 클래스입니다. get_instance() 메소드를 사용하세요.")
        RealEstateDB._instance = self
        # self.conn = self._connect_db() # 클래스 초기화 시 DB 연결
        # self._create_table() # 테이블 생성도 초기화 시점에 수행

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = RealEstateDB() # 최초 호출 시 인스턴스 생성
        return cls._instance

    def _connect_db(self):
        conn = sqlite3.connect('crawled_data.db') # DB 파일명 고정
        return conn

    def _create_table(self):
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                atclNo TEXT,
                cortarNo TEXT,
                atclNm TEXT,
                atclStatCd TEXT,
                rletTpCd TEXT,
                uprRletTpCd TEXT,
                rletTpNm TEXT,
                tradTpCd TEXT,
                tradTpNm TEXT,
                vrfcTpCd TEXT,
                flrInfo TEXT,
                prc INTEGER,
                rentPrc INTEGER,
                hanPrc TEXT,
                spc1 TEXT,
                spc2 REAL,
                direction TEXT,
                atclCfmYmd TEXT,
                lat REAL,
                lng REAL,
                atclFetrDesc TEXT,
                tagList TEXT,
                bildNm TEXT,
                minute INTEGER,
                sameAddrCnt INTEGER,
                sameAddrDirectCnt INTEGER,
                cpid TEXT,
                cpNm TEXT,
                cpCnt INTEGER,
                rltrNm TEXT,
                directTradYn TEXT,
                minMviFee INTEGER,
                maxMviFee INTEGER,
                etRoomCnt INTEGER,
                tradePriceHan TEXT,
                tradeRentPrice INTEGER,
                tradeCheckedByOwner TEXT,
                cpLinkVO TEXT,
                dtlAddrYn TEXT,
                dtlAddr TEXT,
                isVrExposed TEXT
            )
        ''')
        self.conn.commit() # 테이블 생성 쿼리 commit

    def get_cursor(self):
        return self.conn.cursor()

    def close_connection(self):
        if self.conn:
            self.conn.close()
            self.conn = None # 명시적으로 None 설정