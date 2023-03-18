type CheckoutRequest = {
 cart_id: number,
 transaction_payment: string,
 delivery_provider: string,
 delivery_status: string
}

export default CheckoutRequest