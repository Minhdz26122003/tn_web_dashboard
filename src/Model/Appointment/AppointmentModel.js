class AppointmentModel {
  constructor({
    appointmnet_id,
    uid,
    username,
    car_id,
    gara_id,
    gara_name,
    appointment_date,
    appointment_time,
    status,
    reason,
  }) {
    Object.assign(this, {
      appointmnet_id,
      uid,
      username,
      car_id,
      gara_id,
      gara_name,
      appointment_date,
      appointment_time,
      status,
      reason,
    });
  }
}

export default AppointmentModel;
