
import paramiko

hostname = "20.79.218.109"
username = "student"
password = "Alex27012000"


aux="grep cpu /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'"
commands=[aux]
client=paramiko.SSHClient()

client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(hostname=hostname,username=username,password=password)

except:
    print("[!]")

for command in commands:
        # print("="*50, command, "="*50)
        stdin, stdout, stderr = client.exec_command(command)
        print(stdout.read().decode())
        err = stderr.read().decode()
        if err:
            print(err)