#!/bin/bash

function __print_section {
	SECTION_NAME="$1"
	echo
	echo -e "\033[94m*** $SECTION_NAME ***\033[0m"
}

function __ask_yesno {
	PROMPT="$1"
	while true; do
		echo -en "\033[97m$PROMPT (\033[92mY\033[0m/\033[91mn\033[97m)?\033[0m "
		read -r ans
		if [[ "$ans" == "Y" ]]; then
			return 0
		elif [[ "$ans" == "n" || "$ans" == "N" ]]; then
			return 1
		else
			echo -e "\"$ans\" was not understood. Please enter \033[97mY\033[0m or \033[97mn\033[0m"
		fi
	done
}

function __check_dep {
	DEP_NAME="$1"
	DEP_CHECK_CMD="$2"
	DEP_INSTALLATION_CMD="$3"

	echo -n "Checking $DEP_NAME is installed... "

	if $DEP_CHECK_CMD > /dev/null 2>&1; then
		echo "✅" # dependency is indeed installed
	else
		echo -ne "❌\n\t$DEP_NAME is not installed. "
		if __ask_yesno "Would you like to install it"; then
			echo -e "Installing $DEP_NAME with command \033[97m$DEP_INSTALLATION_CMD\033[0m"
			sh -c "$DEP_INSTALLATION_CMD"
		else
			echo "Won't install dependency $DEP_NAME"
		fi
	fi
}

function __download {
	TOOL="$1"
	REMOTE_FILE="$2"
	LOCAL_FILE="$3" # optional, default = REMOTE_FILE
	if [[ -z "$LOCAL_FILE" ]]; then
		LOCAL_FILE="$REMOTE_FILE"
	fi

	if [[ "$TOOL" == "curl" ]]; then
		echo "$LOCAL_FILE"
		curl --progress-bar --output "$LOCAL_FILE" "$ROOT_DOWNLOAD_URL/$REMOTE_FILE"
	elif [[ "$TOOL" == "wget" ]]; then
		wget --quiet --show-progress --output-document "$LOCAL_FILE" "$ROOT_DOWNLOAD_URL/$REMOTE_FILE"
	else
		echo "Sorry can't handle tool $TOOL"
		echo "This is likely to be a programming error. Sorry!"
		exit 1
	fi
}

function help {
	echo Deploy web mock app for testing
	echo
	echo "Syntax: $0 -d domain [-w directory] [-g] [-t] [-f filepath]"
	echo Options:
	echo " -h               Display this help message and exit"
	echo " -d domain        Domain name, e.g. test.benjaminguzman.dev"
	echo " -w directory     Working directory. Must be an empty directory"
	echo "                  This directory will store the git repo or downloaded files"
	echo "                    Default: $HOME"
	echo " -t               You plan to add TLS (https)"
	echo "                    Providing this flag will bind nginx server to 127.0.0.1:8080"
	echo "                    instead of [::]:80 and 0.0.0.0:80, and"
	echo "                    frontend will use https protocol instead of http."
	echo "                    Notice however, you should configure TLS on your own."
	echo " -g               Use git instead of downloading files with curl or wget"
	echo " -f filepath      Path to docker-compose.yml for v1."
	echo "                  Only provide this option if you want to deploy v1"
}

ROOT_DOWNLOAD_URL="https://raw.githubusercontent.com/BenjaminGuzman/webmock/v2"

DOMAIN=""
WORKING_DIR="$HOME"
USE_GIT="f"
USE_TLS="f"
V1_COMPOSE_FILE=""
while getopts ":hd:w:f:gt" opt; do
	case $opt in
		h)
			help
			exit;;
		d)
			DOMAIN="$OPTARG"
			;;
		w)
			WORKING_DIR="$OPTARG"
			;;
		g)
			USE_GIT="t"
			;;
		t)
			USE_TLS="t"
			;;
		f)
			V1_COMPOSE_FILE="$OPTARG"
			;;
		*)
			echo "Invalid option '$opt'"
			exit;;
	esac
done

# Check required arguments
if [[ -z "$DOMAIN" ]]; then
	echo -e "\033[91mYou must provide a domain name\033[0m"
	help
	exit 1
fi

if [[ ! -d "$WORKING_DIR" ]]; then
	echo "Directory $WORKING_DIR doesn't exist. "
	if __ask_yesno "Would you like to create $WORKING_DIR"; then
		mkdir -p "$WORKING_DIR"
	fi
fi

__print_section "Detecting distribution"
DISTROS=(gentoo ubuntu debian fedora centos rocky)
DISTRO=""

if which lsb-release > /dev/null 2>&1; then # detect distro with lsb-release
	LSB_RELEASE_OUT=$(lsb-release --id --short)
	for distro in "${DISTROS[@]}"; do
		occurrences=$(grep --ignore-case "$distro" --count <<< "$LSB_RELEASE_OUT")
		if [[ "$occurrences" -ne "0" ]]; then
			DISTRO="$distro"
			break
		fi
	done
else # detect distro with release files
	if [[ -f "/etc/redhat-release" ]]; then
		# /etc/redhat-release does contain the distribution name
		# e.g. "Rocky Linux release 8.6 (Green Obsidian)", "CentOS Stream release 9", ...
		for distro in fedora centos rocky; do
			occurrences=$(more /etc/redhat-release | grep --ignore-case "$distro" --count)
			if [[ "$occurrences" -ne "0" ]]; then
				DISTRO="$distro"
				break
			fi
		done
	elif [[ -f "/etc/debian_version" ]]; then
		# /etc/debian_version only contains information about the version
		# e.g. 11, sid, ...
		# So, to differentiate we use uname
		for distro in debian ubuntu; do
			occurrences=$(uname -a | grep --ignore-case "$distro" --count)
			if [[ "$occurrences" -ne "0" ]]; then
				DISTRO="$distro"
			fi
		done
	elif [[ -f "/etc/gentoo-release" ]]; then
		DISTRO="gentoo"
	fi
fi

echo "Distribution detected: $DISTRO"

__print_section "Checking dependencies"
if [[ "$DISTRO" == "gentoo" ]]; then
	# Gentoo system could be running openrc instead of systemd
	# In which case proceeding with installation would be useless as it'll fail
	echo "Detected that you're on Gentoo Linux"
	echo "Because of that it is recommended to execute the steps manually"
	echo "so you have granular control of the deploy."
	if ! __ask_yesno "Would you like to proceed anyway"; then
		exit 0
	fi

	__check_dep docker "systemctl cat docker" "sudo emerge app-containers/docker app-containers/docker-cli; sudo systemctl start docker"
elif [[ "$DISTRO" == "ubuntu" || "$DISTRO" == "debian" ]]; then
	__check_dep docker "systemctl cat docker" "sudo apt-get update; sudo apt-get install -y ca-certificates curl gnupg lsb-release; sudo mkdir -p /etc/apt/keyrings; curl -fsSL https://download.docker.com/linux/$DISTRO/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg; echo \"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$DISTRO  $(lsb_release -cs) stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null; sudo apt-get update; sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin; sudo systemctl start docker"
elif [[ "$DISTRO" == "fedora" ]]; then
	__check_dep docker "systemctl cat docker" "sudo dnf install -y dnf-plugins-core; sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo; sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin; sudo systemctl start docker"
elif [[ "$DISTRO" == "centos" || "$DISTRO" == "rocky" ]]; then
	__check_dep docker "systemctl cat docker" "sudo yum install -y yum-utils; sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo; sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin; sudo systemctl start docker"
fi

__print_section "Downloading configuration files"
MICROSERVICES=(auth cart content users)
cd "$WORKING_DIR" || exit 1
if [[ "$USE_GIT" == "t" ]]; then
	echo Cloning repository using git

	# First, verify git is installed
	if [[ "$DISTRO" == "gentoo" ]]; then
		__check_dep git "git --help" "sudo emerge dev-vcs/git"
	elif [[ "$DISTRO" == "ubuntu" || "$DISTRO" == "debian" ]]; then
		__check_dep git "git --help" "sudo apt-get install -y git"
	elif [[ "$DISTRO" == "fedora" ]]; then
		__check_dep git "git --help" "sudo dnf install -y git"
	elif [[ "$DISTRO" == "centos" || "$DISTRO" == "rocky" ]]; then
		__check_dep git "git --help" "sudo yum install -y git"
	fi

	git clone https://github.com/BenjaminGuzman/webmock.git .
	git checkout v2 # this script is intended to be used with v2 only

	# Move .env.example to .env.prod for each microservice
	for microservice in "${MICROSERVICES[@]}"; do
		mv "backend/$microservice/.env.example" "backend/$microservice/.env.prod"
	done
else
	tool=wget
	for possible_tool in wget curl; do
		if which $possible_tool > /dev/null 2>&1; then
			tool=$possible_tool
			break
		fi
	done

	echo -e "Downloading files using \033[97m$tool\033[0m"
	mkdir -p backend/{users,content,auth,cart} frontend mongo postgres > /dev/null 2>&1

	# .env files
	for microservice in "${MICROSERVICES[@]}"; do
		__download "$tool" "backend/$microservice/.env.example" "backend/$microservice/.env.prod"
	done

	# Other files
	FILES=("mongo/001-users.js" "postgres/001-db-init.sh" "postgres/002-ddl.sql" "docker-compose.yml" "backend/auth/random-secret.sh")
	for file in "${FILES[@]}"; do
		__download "$tool" "$file"
	done
fi

__print_section "Creating random secret for auth microservice"
echo "Executing script backend/auth/random-secret.sh..."
cd backend/auth || exit 1
chmod u+x random-secret.sh
./random-secret.sh > /dev/null 2>&1
cd "$WORKING_DIR" || exit 1

__print_section "Changing domain name to $DOMAIN"
PROTOCOL="http"
if [[ "$USE_TLS" == "t" ]]; then
	PROTOCOL="https"
fi

for microservice in "${MICROSERVICES[@]}"; do
	sed -i "s|https://test.benjaminguzman.dev|$PROTOCOL://$DOMAIN|g" "backend/$microservice/.env.prod"
	echo "backend/$microservice/.env.prod"
done

sed -i "s|https://test.benjaminguzman.dev|$PROTOCOL://$DOMAIN|g" docker-compose.yml

__print_section "Configuring nginx"
if [[ "$USE_TLS" == "t" ]]; then
	echo "TLS is intended to be used. Nginx HTTP server will bind to port 8080"
	sed -i 's|"80:80"|"8080:80"|g' docker-compose.yml

	# check nginx is installed
	# TODO: check certbot is installed?
	if [[ "$DISTRO" == "gentoo" ]]; then
		__check_dep nginx "systemctl cat nginx" "sudo emerge www-servers/nginx"
	elif [[ "$DISTRO" == "ubuntu" || "$DISTRO" == "debian" ]]; then
		__check_dep nginx "systemctl cat nginx" "sudo apt-get install -y nginx"
	elif [[ "$DISTRO" == "fedora" ]]; then
		__check_dep nginx "systemctl cat nginx" "sudo dnf install -y nginx"
	elif [[ "$DISTRO" == "centos" || "$DISTRO" == "rocky" ]]; then
		__check_dep nginx "systemctl cat nginx" "sudo yum install -y nginx"
	fi
else
	echo "TLS is not intended to be used. Nginx HTTP server will bind to port 80"
fi

START_CONTAINERS_CMD="cd '$WORKING_DIR' && sudo docker compose up -d"
if [[ ! -z "$V1_COMPOSE_FILE" ]]; then
	echo "Configuring request forwarding for V1..."
	sed -i 's/INCLUDE_V1=[a-zA-Z]\+/INCLUDE_V1=true/g' docker-compose.yml
	
	# don't expose ports on V1 compose file, v2 networking will handle that
	sed -i 's/\(\s\+\)-\s*"80:3000"/\1#- "80:3000"/g' "$V1_COMPOSE_FILE"
	sed -i 's/\(\s\+\)ports:/\1#ports:/g' "$V1_COMPOSE_FILE"

	V1_COMPOSE_FILE_DIR=$(dirname "$V1_COMPOSE_FILE")
	START_CONTAINERS_CMD="cd '$V1_COMPOSE_FILE_DIR' && sudo docker compose -f '$V1_COMPOSE_FILE' up -d && $START_CONTAINERS_CMD"
else
	echo "Won't forward requests to V1"
	echo If you want to deploy v1 only, you may need to execute these commands:
	echo
	echo sed -i 's/INCLUDE_V1=[a-zA-Z]\+/INCLUDE_V1=false/g' $WORKING_DIR/docker-compose.yml
	
	# expose ports on V1 compose file (undo changes)
	echo sed -i 's/#- "80:3000"/- "80:3000"/g' V1_COMPOSE_FILE
	echo sed -i 's/#ports:/ports:/g' V1_COMPOSE_FILE
fi

__print_section "Creating docker network (webmock-net)"
sudo docker network create webmock-net --driver bridge > /dev/null 2>&1

__print_section "Next steps"
echo " * (Optional) Add TLS certificate using certbot and Let's Encrypt"
echo "     Useful links:"
echo "       https://certbot.eff.org/"
echo
echo " * Start containers"
echo -en "\033[96m"
echo "     $START_CONTAINERS_CMD"
echo -en "\033[0m"
echo

if __ask_yesno "Would you like to start the containers now"; then
	__print_section "Starting containers"
	sh -c "$START_CONTAINERS_CMD"
fi

# remove password from cache
sudo -K
