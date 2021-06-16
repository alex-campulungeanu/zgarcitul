FROM python:3

ARG http_proxy
ARG https_proxy

ENV http_proxy ${http_proxy}
ENV https_proxy ${https_proxy}
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN apt-get update
RUN apt install -y vim
RUN \
    echo 'alias py="/opt/venv/bin/python"' >> /root/.bashrc && \
    echo 'alias ls="ls --color=auto"' >> /root/.bashrc && \
    echo 'PS1="\[\033[1;33m\][\u@\h \W >>>] \$ \[\033[0m\]"' >> /root/.bashrc && \
#fix vim on Debian
    echo 'if filereadable("/usr/share/vim/vim81/defaults.vim") \n \
source /usr/share/vim/vim81/defaults.vim \n \
endif \n \
" now set the line that the defaults file is not reloaded afterwards! \n \
let g:skip_defaults_vim = 1 \n \
" turn of mouse \n \
set mouse= \n \
" other override settings go here ' >> /etc/vim/vimrc.local

RUN python3 -m venv $VIRTUAL_ENV

COPY docker-entrypoint.sh /usr/local/bin/
RUN sed -i -e 's/\r$//' /usr/local/bin/docker-entrypoint.sh

WORKDIR /app

COPY requirements.txt .

# install wheel becouse pip hide this
RUN pip install wheel
RUN pip install --no-cache-dir -r requirements.txt


ENTRYPOINT ["docker-entrypoint.sh"]
# CMD ["/bin/bash" , "docker-entrypoint.sh"]
# CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]
CMD [ "tail", "-f", "/dev/null" ]