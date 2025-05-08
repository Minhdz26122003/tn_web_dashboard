class AppointmentModel {
  constructor({
    appointment_id,
    uid,
    username,
    license_plate,
    car_id,
    gara_id,
    gara_name,
    description,
    service_name,
    appointment_date,
    appointment_time,
    status,
    reason,
  }) {
    Object.assign(this, {
      appointment_id,
      uid,
      username,
      license_plate,
      car_id,
      gara_id,
      gara_name,
      description,
      service_name,
      appointment_date,
      appointment_time,
      status,
      reason,
    });
  }
}

export default AppointmentModel;
