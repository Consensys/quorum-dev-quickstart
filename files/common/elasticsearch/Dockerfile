FROM docker.elastic.co/elasticsearch/elasticsearch:7.9.3

USER root
ADD elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml
RUN chown elasticsearch:elasticsearch config/elasticsearch.yml
USER elasticsearch

# Run local(:9200) and skip prod checks
ENV http.host=0.0.0.0
ENV network.host=localhost
ENV xpack.security.enabled=false
ENV bootstrap.memory_lock=true
ENV ES_JAVA_OPTS="-Xms1g -Xmx1g"
ENV ES_MASTER true
ENV ES_DATA true
ENV ES_MIN_MASTER_NODES 1
ENV ES_CLUSTER_NAME ps-local-elasticsearch

