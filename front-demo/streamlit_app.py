import streamlit as st
import pandas as pd
import numpy as np
import math

import logging

from style import card_style

# job name
JOB_NAME = "streamlit_demo".upper()


# logger
logger = logging.getLogger()
logger.setLevel(logging.WARN)
formatter = logging.Formatter(f"%(asctime)s [{JOB_NAME}] %(levelname)s: %(message)s")
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)


# title and data prepare
st.set_page_config(layout="wide")
st.title('부동산 매물 🏡')

filepath = "./data/all_info_contained_articles.csv"
df = pd.read_csv(filepath)

st.success("데이터 로드 완료!")

# 전처리
df["supply_area"] = df["supply_area"].replace("-", 0.0).astype("float")



# Define columns for filtering
numeric_columns = ["deposit_fee", "rent_fee", "supply_area", "exclusive_area"]
categorical_column = "article_class"

# Filtering components
st.sidebar.header("Filter Options")

# Numeric filters (using sliders)
numeric_filters = {}
for col in numeric_columns:
    min_val = df[col].min()
    max_val = df[col].max()
    default_min = min_val
    default_max = max_val  # You could also pre-calculate percentiles or similar

    filter_range = st.sidebar.slider(
        f"{col} 범위",
        min_value=float(min_val),  # Explicitly cast to float
        max_value=float(max_val),  # Explicitly cast to float
        value=(float(default_min), float(default_max)),
        step=1.0, # Adjust step size as needed, 1.0 or 0.1 might be appropriate
    )
    numeric_filters[col] = filter_range


# Categorical filter (using multiselect)
unique_classes = df[categorical_column].unique().tolist()
selected_classes = st.sidebar.multiselect(
    "매물 종류 선택", unique_classes, default=unique_classes
)  # Default to all classes selected

# Apply filters
df_filtered = df.copy()  # Start with a copy of the original DataFrame

# Apply numeric filters
for col, (min_val, max_val) in numeric_filters.items():
    df_filtered = df_filtered[
        (df_filtered[col] >= min_val) & (df_filtered[col] <= max_val)
    ]

# Apply categorical filter
df_filtered = df_filtered[df_filtered[categorical_column].isin(selected_classes)]



# Display the filtered DataFrame
if df_filtered.empty:
    st.warning("선택한 필터 조건에 맞는 결과가 없습니다.")
else:
    num_cols = 5  # 한 줄에 표시할 카드 수
    cols = st.columns(num_cols)  # Define cols here, outside the loop

    for index, row in df_filtered.iterrows():
        col_index = index % num_cols

        with cols[col_index]:
            # 카드 스타일 적용
            st.markdown(card_style, unsafe_allow_html=True)

            # 카드 HTML 생성
            if isinstance(row['image_url'], float):
                image_url = "https://thumbs.dreamstime.com/b/modern-luxury-house-exterior-sunset-warm-interior-lights-lush-green-lawn-343134353.jpg"
            else:
                print(type(row["image_url"]))
                image_url = "https://landthumb-phinf.pstatic.net/" + row["image_url"]
            
            card_html = f"""
            <div class="card">
                <img src="{image_url}" class="card-image">
                <h3>매물번호 {row['article_no']}: {row['article_title']}</h3>
                <p><strong>종류:</strong> {row['article_class']} {row['transaction_type']}</p>
                <p><strong>평수:</strong> 전용{row['exclusive_area']} / 공급{row['supply_area']}</p>
                <p><strong>가격:</strong> 보증금 {row['deposit_fee']} / 월세액 {row['rent_fee']}</p>
            </div>
            """

            # Streamlit에 카드 HTML 표시
            st.markdown(card_html, unsafe_allow_html=True)