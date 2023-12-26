def getInfoAttribute(info, field):
    try:
        value = info.get(field)
    except:
        value = ''
    if value is None:
        value = ''
    return value
