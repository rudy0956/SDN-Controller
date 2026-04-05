from mininet.topo import Topo
from mininet.net import Mininet
from mininet.node import RemoteController, OVSSwitch
from mininet.cli import CLI
from mininet.log import setLogLevel

class SDNTrafficTopo(Topo):
    """
    Custom Topology for Traffic Engineering
    Architecture:
    - 4 Switches forming a mesh/loop (s1, s2, s3, s4)
    - 4 Hosts (h1 to s1, h2 to s2, h3 to s3, h4 to s4)
    This creates multiple paths between nodes to demonstrate rerouting
    during link congestion.
    """
    def build(self):
        # Add Switches
        s1 = self.addSwitch('s1', dpid='0000000000000001')
        s2 = self.addSwitch('s2', dpid='0000000000000002')
        s3 = self.addSwitch('s3', dpid='0000000000000003')
        s4 = self.addSwitch('s4', dpid='0000000000000004')

        # Add Hosts
        h1 = self.addHost('h1', mac='00:00:00:00:00:01', ip='10.0.0.1/24')
        h2 = self.addHost('h2', mac='00:00:00:00:00:02', ip='10.0.0.2/24')
        h3 = self.addHost('h3', mac='00:00:00:00:00:03', ip='10.0.0.3/24')
        h4 = self.addHost('h4', mac='00:00:00:00:00:04', ip='10.0.0.4/24')

        # Connect Hosts to Switches
        self.addLink(h1, s1, bw=100)
        self.addLink(h2, s2, bw=100)
        self.addLink(h3, s3, bw=100)
        self.addLink(h4, s4, bw=100)

        # Connect Switches to create a ring topology with a cross-link
        # Primary path: s1 <-> s2 <-> s3
        # Alternate path: s1 <-> s4 <-> s3
        self.addLink(s1, s2, bw=10) # Bottleneck link to cause congestion
        self.addLink(s2, s3, bw=100)
        self.addLink(s3, s4, bw=100)
        self.addLink(s4, s1, bw=100)
        self.addLink(s2, s4, bw=100)

def run():
    setLogLevel('info')
    topo = SDNTrafficTopo()
    # Connect to the external Ryu controller
    net = Mininet(topo=topo, controller=RemoteController, switch=OVSSwitch, link=None) # Note: For bandwidth limits TCLink is needed, but omitting for simple OpenFlow testing
    
    # Add external controller
    c0 = net.addController('c0', controller=RemoteController, ip='127.0.0.1', port=6653)
    
    net.start()
    CLI(net)
    net.stop()

if __name__ == '__main__':
    run()
