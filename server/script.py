
import os
import sys


aux = "grep cpu /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'"
returned = os.system(aux)
print(returned)
