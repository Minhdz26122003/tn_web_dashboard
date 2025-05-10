class Payment {
  constructor({
    payment_id,
    appointment_id,
    payment_date,
    form,
    status,
    total_price,
  }) {
    Object.assign(this, {
      payment_id,
      appointment_id,
      payment_date,
      form,
      status,
      total_price,
    });
  }
}

export default Payment;
