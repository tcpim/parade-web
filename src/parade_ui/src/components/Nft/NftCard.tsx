import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export interface NftCardProps {
  index: string;
  children: React.ReactNode;
}

export const NftCard = ({ index, children }: NftCardProps) => {
  const CardContentNoPadding = styled(CardContent)(`
          padding: 0;
          &:last-child {
              padding-bottom: 0px;
          };
          display: flex;
          justify-content: space-between;
          button {
              justify-content: center;
              min-width: 25%;
          }
          & .MuiTypography-root {
              display:flex;
              flex-direction: column;
              justify-content: center;
          }
      `);

  return (
    <Card sx={{ maxWidth: 350, mr: 1, mt: 1 }}>
      {children}
      <CardContentNoPadding>
        <Typography variant="subtitle2" component="div">
          {"#".concat(index)}
        </Typography>
      </CardContentNoPadding>
    </Card>
  );
};
