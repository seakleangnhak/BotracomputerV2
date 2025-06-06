import type { PartytownConfig } from "@builder.io/partytown/integration";
import { partytownSnippet } from "@builder.io/partytown/integration";

/**
 * Props for `<QwikPartytown/>`, which extends the Partytown Config.
 *
 * https://github.com/BuilderIO/partytown#config
 *
 * @public
 */
export type PartytownProps = PartytownConfig

/**
 * @public
 * You can pass setting with props
 */
export const QwikPartytown = (props: PartytownProps): any => {
  return <script dangerouslySetInnerHTML={partytownSnippet(props)} />;
};
