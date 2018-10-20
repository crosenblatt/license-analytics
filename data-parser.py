import re

regex = re.compile('%(\w{2})([^\^]*)\^([^\$]*)\$([^\$]*)\$([^\$]*)\$\^([^\^]*)\^\?\;(\d{6})(\d*)\=(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})\?\+10(\d{9})  (\w) (\w)             (\d)(\d)(\d{2})(\d{3})(\w{3})(\w{3})')
data = input("Swipe ID: ")
match = regex.match(data)
split_data = {
    "state": match.group(1),
    "city": match.group(2),
    "last_name": match.group(3),
    "first_name": match.group(4),
    "middle_name": match.group(5),
    "address": match.group(6),
    "iin": match.group(7),
    "license_number": match.group(8),
    "expiration_year": match.group(9),
    "expiration_month": match.group(10),
    "dob_year": match.group(11),
    "dob_month": match.group(12),
    "dob_day": match.group(13),
    "zip_code": match.group(14),
    "license_class": match.group(15),
    "license_restriction": match.group(16),
    "gender": match.group(17),
    "height_ft": match.group(18),
    "height_in": match.group(19),
    "weight": match.group(20),
    "hair_color": match.group(21),
    "eye_color": match.group(22)
}

print(split_data)