class CenterModel {
  constructor({
    gara_id,
    gara_name,
    gara_address,
    phone,
    email,
    gara_img,
    x_location,
    y_location,
  }) {
    Object.assign(this, {
      gara_id,
      gara_name,
      gara_address,
      phone,
      email,
      gara_img,
      x_location,
      y_location,
    });
  }
}

export default CenterModel;
