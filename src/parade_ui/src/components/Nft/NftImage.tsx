export interface NftImageProps {
  imageUrl: string;
  width: number;
  imageType: string;
  imageHeightWidthRatio: number | undefined;
}

export const NftImage = ({
  imageUrl,
  width,
  imageType,
  imageHeightWidthRatio,
}: NftImageProps) => {
  if (imageHeightWidthRatio !== undefined) {
    if (imageType === "svg") {
      return (
        <iframe
          width={"500px"}
          height={`${width * imageHeightWidthRatio}px`}
          src={imageUrl}
        ></iframe>
      );
    } else if (imageType === "img") {
      return (
        <img
          src={imageUrl}
          width={`${width}px`}
          height={`${width * imageHeightWidthRatio}px`}
          style={{ objectFit: "fill" }}
          // loading="lazy"
        />
      );
    }
  }

  return (
    <img
      src={imageUrl}
      width={`${width}px`}
      style={{ objectFit: "fill" }}
      loading="lazy"
    />
  );
};
