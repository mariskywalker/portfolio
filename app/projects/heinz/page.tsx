import HeinzOfficialPage from "./HeinzOfficialPage";

type Props = { searchParams?: Promise<{ embed?: string }> | { embed?: string } };

export default function HeinzPage(props: Props) {
  return <HeinzOfficialPage {...props} />;
}

