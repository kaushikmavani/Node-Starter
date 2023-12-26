const deepConverter = async (object) => {
  const entries = Object.entries(object).map(([key, value]) => {
    const newValue =
      (value === "" || value == null) && typeof value != "boolean" ? "" : value
    return [key, newValue]
  })

  const converted = await Promise.all(
    entries.map(async ([key, value]) => {
      if (Array.isArray(value)) {
        const convertedValue = await deepConverter(value)
        return [key, Object.values(convertedValue)]
      } else if (typeof value == "object") {
        const convertedValue = await deepConverter(value)
        return [key, convertedValue]
      } else if (typeof value == "boolean") {
        return [key, value]
      }

      return [key, value.toString()]
    })
  )

  return Object.fromEntries(converted)
}

// convert to string
export default async (response) => {
  return await deepConverter(JSON.parse(response))
}
