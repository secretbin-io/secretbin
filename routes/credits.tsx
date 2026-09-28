import { PageContent, Table } from "components"
import { TranslationKey } from "lang"
import { ComponentChildren } from "preact"
import { define } from "utils"
import { TrimPrefix, TrimSuffix } from "utils/helpers"
import { useTranslation } from "utils/hooks"
import { State } from "utils/state"
import credits from "../credits.json" with { type: "json" }

type CreditTranslationKey = TrimPrefix<"Credits", TranslationKey>

type SectionTranslationKey = TrimSuffix<"Title" | "Description", CreditTranslationKey>

interface TextProps {
	state: State
	text: CreditTranslationKey
}

function Text({ state, text }: TextProps): ComponentChildren {
	const $ = useTranslation(state.language, "Credits")

	return (
		<p
			class="text-justify [&_a]:underline mb-5"
			// deno-lint-ignore react-no-danger
			dangerouslySetInnerHTML={{ __html: $(text, { name: state.config.branding.appName }) }}
		/>
	)
}

interface SectionProps {
	state: State
	text: SectionTranslationKey
	children?: ComponentChildren
}

function Section({ state, text, children }: SectionProps): ComponentChildren {
	const $ = useTranslation(state.language, "Credits")

	return (
		<div class="relative overflow-x-auto mb-5">
			<h5 class="mb-2 font-bold text-gray-900 text-xl dark:text-white">
				{$(`${text}.Title`)}
			</h5>
			<Text state={state} text={`${text}.Description`} />
			{children}
		</div>
	)
}

/**
 * Page for show copyright and credit information
 */
export default define.page(({ state }) => {
	const $ = useTranslation(state.language, "Credits")

	return (
		<PageContent title={$("Title")}>
			{state.config.branding.footer !== "SecretBin" && <Text state={state} text="BrandedNotice" />}

			<Text state={state} text="SourceNotice" />

			<Text state={state} text="AutomationNotice" />

			<ul class="pl-10 -mt-2 list-disc [&_a]:underline mb-5">
				<li>
					<a href="https://github.com/secretbin-io/secretbin-cli">SecretBin CLI</a>
				</li>
				<li>
					<a href="https://github.com/secretbin-io/secretbin-python">SecretBin Python</a>
				</li>
				<li>
					<a href="https://github.com/secretbin-io/go-secretbin">SecretBin Go</a>
				</li>
			</ul>

			<Text state={state} text="Description" />

			<Section state={state} text="Components">
				<Table
					headers={{
						component: $("Components.Headers.Component"),
						author: $("Components.Headers.Author"),
						license: $("Components.Headers.License"),
					}}
					rows={credits.map((d) => ({
						component: d.repository ? <a href={d.repository} target="_blank">{d.name}</a> : <>{d.name}</>,
						author: (d.author ?? "").split(", ").map((x, i) =>
							i === 0 ? x : (
								<span key={i}>
									,<br />
									{x}
								</span>
							)
						),
						license: d.licenseFile
							? <a href={d.licenseFile} target="_blank">{d.license}</a>
							: <>{d.license}</>,
					}))}
				/>
			</Section>

			<Section state={state} text="AIDisclosure" />
		</PageContent>
	)
})
