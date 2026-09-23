import { PageContent, Table } from "components"
import { TranslationKey } from "lang"
import { define } from "utils"
import { useTranslation } from "utils/hooks"
import credits from "../credits.json" with { type: "json" }
import { TrimPrefix } from "../utils/helpers/strings.ts"

/**
 * Page for show copyright and credit information
 */
export default define.page(({ state }) => {
	const $ = useTranslation(state.language, "Credits")

	const Text = ({ name }: { name: TrimPrefix<"Credits", TranslationKey> }) => (
		<p
			class="text-justify [&_a]:underline mb-5"
			// deno-lint-ignore react-no-danger
			dangerouslySetInnerHTML={{ __html: $(name, { name: state.config.branding.appName }) }}
		/>
	)

	return (
		<PageContent title={$("Title")}>
			{state.config.branding.footer !== "SecretBin" && <Text name="BrandedNotice" />}

			<Text name="SourceNotice" />

			<Text name="AutomationNotice" />

			<Text name="Description" />

			<div class="relative overflow-x-auto">
				<h5 class="mb-2 font-bold text-gray-900 text-xl dark:text-white">
					{$("AIDisclosure.Title")}
				</h5>
				<Text name="AIDisclosure.Description" />
			</div>

			<div class="relative overflow-x-auto">
				<h5 class="mb-2 font-bold text-gray-900 text-xl dark:text-white">
					{$("Components.Title")}
				</h5>
				<Text name="Components.Description" />

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
			</div>
		</PageContent>
	)
})
