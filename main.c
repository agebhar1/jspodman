#include <sys/types.h>
#include <sys/un.h>
#include <sys/socket.h>
#include <errno.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int run = 1;

void sigINT(int signal) {
    run = 0;
}

int main() {

    signal(SIGINT, sigINT);

    char buffer[1024];

    int fd, peer_fd;
    struct sockaddr_un addr, peer_addr;
    socklen_t peer_add_size;

    if ((fd = socket(AF_UNIX, SOCK_STREAM, 0)) == -1) {
        perror("socket");
        exit(1);
    }

    memset(&addr, 0, sizeof(struct sockaddr_un));
    addr.sun_family = AF_UNIX;
    strncpy(addr.sun_path, "main.sock", sizeof(addr.sun_path) -1);

    if (bind(fd, (struct sockaddr *) &addr, sizeof(struct sockaddr_un)) == -1) {
        perror("bind");
        exit(1);
    }

    if (listen(fd, 0) == -1) {
        perror("listen");
        exit(1);
    }

    peer_add_size = sizeof(struct sockaddr_un);

    while(run == 1) {
        printf("wait for client ...\n");
        if ((peer_fd = accept(fd, (struct sockaddr *) &peer_addr, &peer_add_size)) == - 1) {
            perror("accept");
            exit(1);
        }

        recv(peer_fd, buffer, 1024, 0);
        printf("%s|\n", buffer);

        int ret;
        int loop = 1;

        sprintf(buffer, "HTTP/1.1 200 OK\n\n");
        while (run == 1) {

            if ((ret = send(peer_fd, buffer, strlen(buffer)+1, MSG_NOSIGNAL)) == -1) {
                if (errno == EPIPE) {
                    break;
                }
            }

            sprintf(buffer, "ping #%d", loop);

            sleep(1);
            loop += 1;
        }
    }

    unlink(addr.sun_path);

    return 0;

}