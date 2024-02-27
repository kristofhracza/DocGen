import markdown, json, os
from collections import deque
from dotenv import load_dotenv

load_dotenv()
PUBLIC_FOLDER = os.getenv("PUBLIC_FOLDER")
# Edit this if you need more
ASSESTS = '''
<link rel="stylesheet" href="{0}assets/style.css">
<link rel="stylesheet" href="{0}assets/prism.css">
<script type="text/javascript" src="{0}assets/prism.js"></script>
'''

# All operations that are needed for file conversion and structuring
class Converter():
    def __init__(self):
        self.structure = {}
        self.return_links = {}

    # Here we proecess the JSON file into a dict
    # Path structures are created
    def process_structure(self,_dict):
        result = {}
        queue = deque([("", _dict)])
        
        while queue:
            path, node = queue.popleft()
            if isinstance(node, dict):
                for key, value in node.items():
                    if path:
                        new_key = f"{path}/{key}"
                    else:
                        new_key = key
                    queue.append((new_key, value))
            else:
                result[path] = node

        # {DESTINATION : ORIGIN}
        self.structure = result

        return self.structure



    # Converting MD files to HTML
    # Also making DIRs for said files
    def convert_md(self):
        json_data = {}
        for dest,orig in self.structure.items():
            # Make the directory
            dirs = dest.split("/")
            folder =  dest.split("/")
            folder.remove(dirs[-1])
            dest_folder = f"{PUBLIC_FOLDER}/{'/'.join(folder)}"
            dest_file = f"{PUBLIC_FOLDER}/{'/'.join(dirs)}.html"

            json_data[dest] = f"{'/'.join(dirs)}.html"

            if os.path.exists(dest_folder) == False:
                os.makedirs(dest_folder,exist_ok=True)

            # Convert
            markdown.markdownFromFile(input=orig, output=dest_file, extensions=["pymdownx.superfences","markdown.extensions.tables"])

            # Add assets
            with open(dest_file, "r+",encoding="UTF-8") as f:
                assets = ASSESTS.format("../" * len(folder))
                content = f.read()
                f.seek(0, 0)
                f.write(assets.rstrip('\r\n') + '\n' + content)
                f.close()

        json_file = open("LINKS.json","w",encoding="UTF-8")
        json_file.write(json.dumps(json_data))
        json_file.close()

    # Start all the methods
    def start(self):
        summary = open("SUMMARY.json","r")
        structure = json.loads(summary.read())
        self.process_structure(structure)
        self.convert_md()


if __name__ == "__main__":
    s = Converter()
    s.start()