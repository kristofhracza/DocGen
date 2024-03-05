import markdown, json, os
from collections import deque
from dotenv import load_dotenv

load_dotenv()
PUBLIC_FOLDER = os.getenv("PUBLIC_FOLDER")
# Edit this if you need more
ASSESTS = '''
<link rel="stylesheet" href="{0}assets/css/style.css">
<link rel="stylesheet" href="{0}assets/css/prism.css">
<script type="text/javascript" src="{0}assets/js/prism.js"></script>
'''

# All operations that are needed for file conversion and structuring
class Converter():

    # Generates HTML from MD
    def convert_md(self,orig,dest,dest_folder,folder_depth):
        # Check for DIR
        if os.path.exists(dest_folder) == False:
            os.makedirs(dest_folder,exist_ok=True)

        # Make MD
        markdown.markdownFromFile(input=orig, output=dest, extensions=["pymdownx.superfences","markdown.extensions.tables"])
        # Add assets
        with open(dest, "r+",encoding="UTF-8") as f:
            assets = ASSESTS.format("../" * folder_depth)
            content = f.read()
            f.seek(0, 0)
            f.write(assets.rstrip('\r\n') + '\n' + content)
            f.close()

    # Process origin to destination
    def orig_to_dest(self,traverse_data):
        if isinstance(traverse_data, dict):
            return {key: orig_to_dest(value) for key, value in traverse_data.items()}
        elif isinstance(traverse_data, str) and traverse_data.endswith(".md"):
            # Array into output data
            folder =  traverse_data.split("/")
            folder.pop(0)
            dest_file = f"{PUBLIC_FOLDER}/{'/'.join(folder)}.html".replace(".md","")
            json_data_file = f"{'/'.join(folder)}.html".replace(".md","")
            folder.pop(-1)
            dest_folder = f"{PUBLIC_FOLDER}/{'/'.join(folder)}".replace(".md","")

            self.convert_md(traverse_data,dest_file,dest_folder,len(folder))
            return json_data_file
        else:
            return data

    # Starts the traversing the original json data
    def traverse_summary(self,summary):
        if isinstance(summary, dict):
            return {key: self.traverse_summary(value) for key, value in summary.items()}
        elif isinstance(summary, list):
            return [self.traverse_summary(item) for item in summary]
        else:
            return self.orig_to_dest(summary)

    # Triggers process
    # Writes to LINKS
    def start(self):
        summary = open("SUMMARY.json","r",encoding="UTF-8")
        structure = json.loads(summary.read())
        new_structure = self.traverse_summary(structure)
        links_json = open("LINKS.json","w",encoding="UTF-8")
        links_json.write(json.dumps(new_structure))
        links_json.close()


if __name__ == "__main__":
    s = Converter()
    s.start()