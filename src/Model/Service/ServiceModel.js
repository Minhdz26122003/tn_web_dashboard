class ServiceModel {
  constructor({
    service_id,
    service_name,
    description,
    service_img,
    price,
    time,
  }) {
    Object.assign(this, {
      service_id,
      service_name,
      description,
      service_img,
      price,
      time,
    });
  }
}

export default ServiceModel;
