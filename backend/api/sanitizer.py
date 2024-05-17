#TODO: sanitize a string that will be displayed as a .MD file or otherwise embedded in HTML to make sure it does't contain any malicious escape sequences, etc.
def sanitize_string(input_str):
	return input_str