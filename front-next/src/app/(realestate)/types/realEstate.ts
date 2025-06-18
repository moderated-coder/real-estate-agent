export interface Article {
  _id: string;
  article_no: string;
  article_id: string;
  article_title: string;
  article_short_description: string;
  agent_office: string;
  agent_hp: string | null;
  article_short_features: string[] | "None";
  article_class: string;
  article_regist_date: string;
  agent_office_post: string;
  deposit_fee: number;
  rent_fee: number;
  management_fee: string;
  gu: string;
  dong: string;
  floor: string;
  exclusive_area: string;
  direction: string;
  transaction_type: string;
  image_url: string | null;
  possible_move: string;
  tag_list: string[];
}
