import CardMedia from "@mui/material/CardMedia";

const svgCanisters = new Set<string>([
  "skjpp-haaaa-aaaae-qac7q-cai",
  "pk6rk-6aaaa-aaaae-qaazq-cai",
]);

interface NftImageProps {
  imageUrl: string;
  canisterId: string;
}
export const NftImage = ({ imageUrl, canisterId }: NftImageProps) => {
  if (imageUrl.endsWith(".mp4")) {
    return (
      <CardMedia component="video" src={imageUrl} autoPlay controls loop />
    );
  } else if (svgCanisters.has(canisterId)) {
    return <CardMedia component="iframe" height="400" src={imageUrl} />;
  } else {
    return (
      <CardMedia component="img" image={imageUrl} height="400" width="300" />
    );
  }
};
