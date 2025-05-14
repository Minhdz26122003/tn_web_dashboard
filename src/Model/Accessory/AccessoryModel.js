class AccessoryModel {
  constructor({
    accessory_id,
    accessory_name,
    quantity,
    price,
    supplier,
    description,
  }) {
    Object.assign(this, {
      accessory_id,
      accessory_name,
      quantity,
      price,
      supplier,
      description,
    });
  }
}

export default AccessoryModel;
