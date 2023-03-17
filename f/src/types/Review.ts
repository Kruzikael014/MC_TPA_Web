type Review = {
  review_id?: number
  created_at?: Date
  rating_value?:number
  delivered_ontime?: boolean
  item_accurate?: boolean
  satisfying_service?: boolean
  reviewer_id?: number
  shop_id?: number
  message?: string
}

export default Review