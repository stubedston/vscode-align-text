# install ggalt pkg
# devtools::install_github("hrbrmstr/ggalt")

library(dplyr)
library(ggplot2)
library(ggalt)

midwest_select <-
	midwest %>%
	filter(
		poptotal > 350000,
		poptotal <= 500000,
		area > 0.01,
		area < 0.1
	)

ggplot(midwest) +
	geom_point(
		aesthetic = aes(col = state, size = popdensity)
	) +
	geom_smooth(
		method = "loess",
		se = FALSE
	) +
	geom_encircle(
		aesthetic = aes(x = area, y = poptotal),
		data = midwest_select,
		color = "red",
		size = 2,
		expand = 0.08
	) +
	labs(
		subtitle = "Area Vs Population",
		y = "Population",
		x = "Area",
		title = "Scatterplot + Encircle",
		caption = "Source: midwest"
	) +
	xlim(c(0, 0.1)) +
	ylim(c(0, 500000))
