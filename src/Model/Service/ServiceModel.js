class ServiceModel {
  constructor({
    service_id,
    service_name,
    description,
    type_id,
    service_img,
    price,
    time,
  }) {
    Object.assign(this, {
      service_id,
      service_name,
      description,
      type_id,
      service_img,
      price,
      time,
    });
  }
}

export default ServiceModel;
