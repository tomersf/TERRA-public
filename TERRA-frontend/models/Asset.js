class Asset {
  constructor(
    id,
    ownerId,
    assetType,
    imageUrl,
    description,
    address,
    price,
    activityHours,
    mapLocation,
    city
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.assetType = assetType;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.address = address;
    this.activityHours = activityHours;
    this.mapLocation = mapLocation;
    this.city = city;
  }
}

export default Asset;
